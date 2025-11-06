import { type NextRequest, NextResponse } from 'next/server';

const proxy = async (req: NextRequest) => {
	return NextResponse.next();
}

export default proxy;