import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = headers().get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check deployment status
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development',
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
      deploymentUrl: process.env.VERCEL_URL || 'unknown',
      region: process.env.VERCEL_REGION || 'unknown'
    };

    // Optional: Send notification if needed
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `✅ Deployment Health Check - ${deploymentInfo.environment}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Environment:* ${deploymentInfo.environment}\n*Commit:* ${deploymentInfo.gitCommit.substring(0, 7)}\n*Branch:* ${deploymentInfo.gitBranch}`
              }
            }
          ]
        })
      });
    }

    return NextResponse.json({
      success: true,
      deployment: deploymentInfo
    });
  } catch (error) {
    console.error('Sync check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}