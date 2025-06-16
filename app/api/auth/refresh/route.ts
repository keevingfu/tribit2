import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    // Get current token from cookie
    const currentToken = request.cookies.get('auth-token')?.value

    if (!currentToken) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // Verify current token
    const user = await authService.verify(currentToken)

    // Generate new token (in real app, would invalidate old token)
    const newToken = btoa(JSON.stringify({ 
      email: user.email, 
      timestamp: Date.now(),
      refreshed: true 
    }))

    // Create response with new token
    const response = NextResponse.json({
      user,
      token: newToken
    })

    // Update auth cookie
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 401 }
    )
  }
}