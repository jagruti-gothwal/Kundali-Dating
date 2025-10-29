import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Sign up route
app.post('/make-server-3a47c9c1/signup', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm since we don't have email server configured
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    return c.json({ 
      success: true, 
      userId: data.user?.id,
      message: 'Account created successfully' 
    })
  } catch (error) {
    console.log('Signup exception:', error)
    return c.json({ error: 'Failed to create account' }, 500)
  }
})

// Create/Update user profile
app.post('/make-server-3a47c9c1/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profileData = await c.req.json()

    // Store user profile in KV store
    await kv.set(`user_profile:${user.id}`, {
      ...profileData,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString()
    })

    return c.json({ success: true, message: 'Profile created successfully' })
  } catch (error) {
    console.log('Profile creation error:', error)
    return c.json({ error: 'Failed to create profile' }, 500)
  }
})

// Get user profile
app.get('/make-server-3a47c9c1/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user_profile:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to get profile' }, 500)
  }
})

// Get all profiles for browsing (excluding current user)
app.get('/make-server-3a47c9c1/profiles', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Get all user profiles
    const allProfiles = await kv.getByPrefix('user_profile:')
    
    // Filter out current user and get only the values
    const profiles = allProfiles
      .filter(item => item.value.userId !== user.id)
      .map(item => item.value)

    return c.json({ profiles })
  } catch (error) {
    console.log('Get profiles error:', error)
    return c.json({ error: 'Failed to get profiles' }, 500)
  }
})

// Record a like/match
app.post('/make-server-3a47c9c1/like', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { targetUserId, compatibility } = await c.req.json()

    // Store the like
    await kv.set(`like:${user.id}:${targetUserId}`, {
      fromUserId: user.id,
      toUserId: targetUserId,
      compatibility,
      timestamp: new Date().toISOString()
    })

    // Check if there's a mutual like (match)
    const reverseLike = await kv.get(`like:${targetUserId}:${user.id}`)
    
    if (reverseLike) {
      // It's a match! Create a match record
      const matchId = `match:${[user.id, targetUserId].sort().join(':')}`
      await kv.set(matchId, {
        users: [user.id, targetUserId],
        matchedAt: new Date().toISOString(),
        compatibility
      })

      return c.json({ success: true, matched: true, matchId })
    }

    return c.json({ success: true, matched: false })
  } catch (error) {
    console.log('Like error:', error)
    return c.json({ error: 'Failed to record like' }, 500)
  }
})

// Get user's matches
app.get('/make-server-3a47c9c1/matches', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Get all matches
    const allMatches = await kv.getByPrefix('match:')
    
    // Filter matches that include current user
    const userMatches = allMatches
      .filter(item => item.value.users.includes(user.id))
      .map(item => item.value)

    // Get profiles for matched users
    const matchesWithProfiles = await Promise.all(
      userMatches.map(async (match) => {
        const otherUserId = match.users.find((id: string) => id !== user.id)
        const profile = await kv.get(`user_profile:${otherUserId}`)
        return {
          ...match,
          profile
        }
      })
    )

    return c.json({ matches: matchesWithProfiles })
  } catch (error) {
    console.log('Get matches error:', error)
    return c.json({ error: 'Failed to get matches' }, 500)
  }
})

// Send message
app.post('/make-server-3a47c9c1/message', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { matchId, text } = await c.req.json()

    // Verify user is part of this match
    const match = await kv.get(matchId)
    if (!match || !match.users.includes(user.id)) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Store message
    const messageId = `message:${matchId}:${Date.now()}`
    const message = {
      id: messageId,
      matchId,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
      read: false
    }

    await kv.set(messageId, message)

    return c.json({ success: true, message })
  } catch (error) {
    console.log('Send message error:', error)
    return c.json({ error: 'Failed to send message' }, 500)
  }
})

// Get messages for a match
app.get('/make-server-3a47c9c1/messages/:matchId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const matchId = c.req.param('matchId')

    // Verify user is part of this match
    const match = await kv.get(matchId)
    if (!match || !match.users.includes(user.id)) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Get all messages for this match
    const allMessages = await kv.getByPrefix(`message:${matchId}:`)
    const messages = allMessages
      .map(item => item.value)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return c.json({ messages })
  } catch (error) {
    console.log('Get messages error:', error)
    return c.json({ error: 'Failed to get messages' }, 500)
  }
})

Deno.serve(app.fetch)
