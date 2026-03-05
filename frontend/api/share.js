export default function handler(req, res) {
    const { img, score } = req.query;
    const productionUrl = 'https://yallabye.vercel.app';

    // Default values if params are missing
    const displayImg = img || 'kham-dam';
    const displayScore = score || '0';

    const imageUrl = `${productionUrl}/assets/${displayImg}.png`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Yalla Bye - Score: ${displayScore}</title>
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="I scored ${displayScore} slaps in Yalla Bye! 🖐️" />
    <meta property="og:description" content="Can you pass me? Click to play now!" />
    <meta property="og:url" content="${productionUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="600" />
    
    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Yalla Bye - Score: ${displayScore}">
    <meta name="twitter:description" content="Can you pass me?">
    <meta name="twitter:image" content="${imageUrl}">

    <!-- Redirect to the game -->
    <meta http-equiv="refresh" content="0;url=${productionUrl}" />
    <script>
        window.location.href = "${productionUrl}";
    </script>
</head>
<body>
    <p>Redirecting to Yalla Bye...</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
}
