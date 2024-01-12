const emailTemplate = (url, name) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                margin-top: 20px;
            }
    
            img {
                max-width: 100%;
                height: auto;
                margin-bottom: 20px;
            }
    
            h1 {
                color: #333333;
            }
    
            p {
                color: #666666;
                line-height: 1.6;
            }
    
            .button {
                display: inline-block;
                padding: 5px;
                font-size: 16px;
                text-align: center;
                text-decoration: none;
                color:  #3498db;
                border-radius: 5px;
                cursor: pointer;
                
            }
            
            .link{
              margin-left:40%;
            }
            
            .link-p{
              font-size: 14px;
              text-align: center;
            }
            
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://culturekart.vercel.app/server/logo.png" alt="Company Logo">
            <h2>Hi ${name} our beloved Chief,</h2>
            <p>Welcome to our exclusive community! We are honored to have you as a part of our journey.</p>
            <p>As you embark on this experience, we want to express our gratitude for choosing IKart.</p>
                <div class="link">
                    <a href="${url}" class="button" target="_blank">Click to verify</a>
                </div>
            <p class="link-p">Click the above link to verify your account</p>
            <p>Feel free to explore our offerings, and if you have any questions or need assistance, don't hesitate to reach out.</p>
            <p>Thank you for trusting us. We look forward to exceeding your expectations!</p>
            <p>Best Regards,<br>IKart</p>
            </div>
    </body>
    </html>
`
}

module.exports = emailTemplate