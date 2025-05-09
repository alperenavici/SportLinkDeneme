import { NextResponse } from 'next/server';

/**
 * Kullanıcı profil bilgilerini getiren API route
 * Bu route frontend tarafından kullanıcının public profil bilgilerini almak için kullanılır
 */
export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const userId = params.id;

    try {
        // API endpoint URL'i - backend URL'iniz ile değiştirin
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        // Headers ve cookies'i request içinden alıyoruz
        let token = '';
        const authHeader = _request.headers.get('Authorization') || '';

        // Bearer prefix'ini kaldır (eğer varsa)
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        if (!token) {
            // Cookie'den token almayı dene
            const cookieString = _request.headers.get('cookie') || '';
            const cookies = Object.fromEntries(
                cookieString.split('; ').map(cookie => {
                    const [name, value] = cookie.split('=');
                    return [name, value];
                })
            );

            if (cookies.authToken) {
                token = cookies.authToken;
            }
        }

        // Kullanıcı bilgisi sorgusu
        console.log(`API isteği yapılıyor: ${apiUrl}/api/users/${userId}`);
        console.log(`Token: ${token ? 'Token var' : 'Token yok'}`);

        const response = await fetch(`${apiUrl}/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
        });

        if (!response.ok) {
            console.error(`API hatası: ${response.status} ${response.statusText}`);
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    success: false,
                    message: errorData.message || `Kullanıcı bilgileri alınamadı. Hata: ${response.status}`
                },
                { status: response.status }
            );
        }

        const userData = await response.json();

        return NextResponse.json({
            success: true,
            data: userData.data || userData
        });
    } catch (error) {
        console.error('Kullanıcı profili alınırken hata:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata')
            },
            { status: 500 }
        );
    }
} 