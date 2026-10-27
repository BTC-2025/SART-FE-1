import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Log directly to the Next.js server terminal as requested by user
    console.log('\n======================================================');
    console.log(`📱 [SART CAPTAIN OTP DISPATCH]`);
    console.log(`📞 Mobile Number: ${phone}`);
    console.log(`🔑 Verification OTP: ${generatedOtp}`);
    console.log(`⏰ Time: ${new Date().toLocaleTimeString('en-IN')}`);
    console.log('======================================================\n');

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${phone}`,
      phone,
      otp: generatedOtp
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
  }
}
