
export default async function encrypt(file) {


    const plainText = await file.arrayBuffer()

    const cryptoKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const rawKey = await crypto.subtle.exportKey("raw", cryptoKey);

    const iv = crypto.getRandomValues(new Uint8Array(12));


    const cipherText =  await crypto.subtle.encrypt({ name: 'AES-GCM', iv },
        cryptoKey, plainText);


    return { cipherText, rawKey, iv }

}


