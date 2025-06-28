"use server"

import { Password } from "@/lib/types"

function arrayBufferToHex(buffer: Uint8Array<ArrayBuffer>) {
    return [...new Uint8Array(buffer)]
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
}

function hexToArrayBuffer(hex: string) {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes.buffer
}

async function getCryptoKey(password: string) {
    const encoder = new TextEncoder()
    const keyMaterial = encoder.encode(password)
    return crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    )
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>) {
    const keyMaterial = await getCryptoKey(password)
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

export async function encrypt(value: string, password: string) {
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKey(password, salt)

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoder.encode(value)
    )

    return {
        cipher: arrayBufferToHex(new Uint8Array(encrypted)),
        iv: arrayBufferToHex(iv),
        salt: arrayBufferToHex(salt)
    }
}

export async function decrypt(data: Password, password: string) {
    const { cipher, iv, salt } = data
    const key = await deriveKey(password, new Uint8Array(hexToArrayBuffer(salt)))

    let decrypted
    try {
        decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: hexToArrayBuffer(iv) },
            key,
            hexToArrayBuffer(cipher)
        )
    } catch(error) { return 'decryption error' }

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
}
