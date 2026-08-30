// middleware.ts (Next.js Frontend)
import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Cookie se token padhein (apna cookie name check kar lein, e.g. 'token')
    const token = request.cookies.get('token')?.value

    // Agar token already hai aur banda login/signin page kholne ki koshish kare
    if (token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/signin'], // Jin pages par bina login ke hi aane dena hai
}