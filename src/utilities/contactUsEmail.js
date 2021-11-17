export const ContactUsEmail = (email, name) => {
    return {
      to: email,
      from: `${email} <${process.env.SENDGRID_API_KEY}>`,
      subject: 'Password reset link',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
        <head>
          <meta charset="utf-8">
        
          <title>Password reset link</title>
          <meta name="description" content="Link to reset your password">
          <meta name="author" content="Highrise Ltd">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        
          <link rel="stylesheet" href="css/styles.css?v=1.0">
        
        </head>
        
        <body>
        <h1>Hi ${name}, do you want to reset your password?</h1> 	
        <h3>Someone requested to reset your Highrise Ltd account password. If it wasn't you, please ignore this e-mail and no changes will be made to your account.</h3> 
        <h3>However, if you have requested to reset your password, please click the link below. You will be redirected to the Highrise Ltd password reset form.</h3>      
        <br>
       
        <br><br>
        <footer>This is an automatically generated e-mail, please do not reply to it. Copyright &#169; 2021 Highrise Ltd All rights reserved.</footer>      
        </body>
        </html>`,
    }
  }
  
 