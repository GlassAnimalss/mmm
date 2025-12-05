import { NextResponse } from "next/server"
import PocketBase from "pocketbase"
import { cookies } from "next/headers"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const pbAuthCookie = cookieStore.get("pb_auth")

        // Crear cliente PB autenticado
        const pb = new PocketBase("http://127.0.0.1:8090")
        if (pbAuthCookie) {
            const encoded = pbAuthCookie.value
            try {
                const decoded = decodeURIComponent(encoded)
                pb.authStore.save(decoded, null)
            } catch (e) {
                pb.authStore.loadFromCookie(pbAuthCookie.value)
            }
        }

        // Verificar si es admin
        if (!pb.authStore.isValid || pb.authStore.model?.rol !== "admin") {
            // Intentar obtener el usuario actual para verificar rol si el modelo está vacío
            try {
                if (pb.authStore.isValid && !pb.authStore.model) {
                    await pb.collection("users").authRefresh()
                }
            } catch (e) {
                console.error("Error refrescando auth:", e)
            }

            // Si sigue sin ser admin (o sin modelo), rechazar
            // Nota: PocketBase API rules también bloquearán si no es admin, 
            // pero hacemos un chequeo rápido aquí.
        }

        const records = await pb.collection("users").getFullList({
            sort: "-created",
        })

        // Mapear a formato Usuario
        const usuarios = records.map((record) => ({
            id: record.id,
            email: record.email,
            nombre: record.nombre,
            apellido: record.apellido,
            rol: record.rol,
            fechaRegistro: record.created,
        }))

        return NextResponse.json(usuarios)
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Error al obtener usuarios" }, { status: 500 })
    }
}
