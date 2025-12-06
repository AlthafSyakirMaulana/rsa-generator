const fs = require('fs');
const path = require('path');

// RSA helper functions
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modInverse(e, phi) {
    let m0 = phi;
    let y = 0, x = 1;
    
    if (phi === 1) return 0;
    
    while (e > 1) {
        let q = Math.floor(e / phi);
        let t = phi;
        
        phi = e % phi;
        e = t;
        t = y;
        
        y = x - q * y;
        x = t;
    }
    
    if (x < 0) x += m0;
    
    return x;
}

function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    
    return result;
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    
    return true;
}

function textToAscii(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let ascii = text.charCodeAt(i);
        result += ascii.toString().padStart(3, '0');
    }
    return result;
}

function asciiToText(asciiStr) {
    let text = '';
    for (let i = 0; i < asciiStr.length; i += 3) {
        let asciiCode = parseInt(asciiStr.substr(i, 3));
        text += String.fromCharCode(asciiCode);
    }
    return text;
}

function splitIntoBlocks(text, blockSize) {
    let blocks = [];
    for (let i = 0; i < text.length; i += blockSize) {
        blocks.push(text.substr(i, blockSize));
    }
    return blocks;
}

// API handlers
module.exports = (req, res) => {
    // Serve the main HTML file
    if (req.method === 'GET' && req.url === '/') {
        const htmlPath = path.join(__dirname, '..', 'index.html');
        try {
            const html = fs.readFileSync(htmlPath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(html);
        } catch (error) {
            res.status(500).json({ error: 'File not found' });
        }
        return;
    }

    // RSA Generate Keys API
    if (req.method === 'POST' && req.url === '/api/generate-keys') {
        try {
            const { p, q } = req.body;
            
            if (!isPrime(p) || !isPrime(q)) {
                return res.status(400).json({ error: 'p dan q harus bilangan prima!' });
            }
            
            const n = p * q;
            const phi = (p - 1) * (q - 1);
            
            // Find e (public key)
            let e = 3;
            while (e < phi && gcd(e, phi) !== 1) {
                e += 2;
            }
            
            const d = modInverse(e, phi);
            
            res.json({
                p,
                q,
                n,
                phi,
                e,
                d,
                publicKey: { e, n },
                privateKey: { d, n }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        return;
    }

    // RSA Encrypt API
    if (req.method === 'POST' && req.url === '/api/encrypt') {
        try {
            const { message, e, n, blockSize = 3 } = req.body;
            
            if (!message || !e || !n) {
                return res.status(400).json({ error: 'Semua field harus diisi!' });
            }
            
            const asciiText = textToAscii(message);
            const blocks = splitIntoBlocks(asciiText, blockSize);
            
            const encryptedBlocks = [];
            const encryptionSteps = [];
            
            blocks.forEach((block, index) => {
                const blockNum = parseInt(block);
                const encrypted = modPow(blockNum, e, n);
                encryptedBlocks.push(encrypted);
                encryptionSteps.push({
                    block: index + 1,
                    original: block,
                    calculation: `${block}^${e} mod ${n}`,
                    result: encrypted
                });
            });
            
            res.json({
                originalMessage: message,
                asciiText,
                blocks,
                encryptedBlocks,
                encryptionSteps,
                ciphertext: encryptedBlocks.join(' ')
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        return;
    }

    // RSA Decrypt API
    if (req.method === 'POST' && req.url === '/api/decrypt') {
        try {
            const { cipherText, d, n } = req.body;
            
            if (!cipherText || !d || !n) {
                return res.status(400).json({ error: 'Semua field harus diisi!' });
            }
            
            const blocks = cipherText.trim().split(/\s+/).map(block => parseInt(block));
            
            const decryptedBlocks = [];
            const decryptionSteps = [];
            
            blocks.forEach((block, index) => {
                const decrypted = modPow(block, d, n);
                decryptedBlocks.push(decrypted.toString().padStart(3, '0'));
                decryptionSteps.push({
                    block: index + 1,
                    original: block,
                    calculation: `${block}^${d} mod ${n}`,
                    result: decrypted
                });
            });
            
            const asciiText = decryptedBlocks.join('');
            const originalText = asciiToText(asciiText);
            
            res.json({
                cipherText: blocks.join(' '),
                decryptedBlocks,
                asciiText,
                originalMessage: originalText,
                decryptionSteps
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        return;
    }

    // Modular Calculator API
    if (req.method === 'POST' && req.url === '/api/modular') {
        try {
            const { base, exponent, modulus } = req.body;
            
            if (isNaN(base) || isNaN(exponent) || isNaN(modulus)) {
                return res.status(400).json({ error: 'Semua field harus diisi dengan angka!' });
            }
            
            const result = modPow(base, exponent, modulus);
            
            res.json({
                calculation: `${base}^${exponent} mod ${modulus}`,
                result
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        return;
    }

    // 404 for other routes
    res.status(404).json({ error: 'Not found' });
};