const template = (texts, codeParameter) => {
  return `<html>
<head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head>
<body>
  <p align="left">${texts[0]}</p>
  <p align="center"><font size="+1">${texts[1]}:</font></p>
  <p align="center"><b><font size="+2">${codeParameter}</font></b></p>
  <p align="center">${texts[2]}</p>
  <p><br>
  </p>
</body>
</html>`
}

exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2))
  console.log(JSON.stringify(process.env, null, 2))
  let texts = []
  if (event.request && event.request.userAttributes && event.request.userAttributes.locale) {
    if (event.triggerSource === 'CustomMessage_ForgotPassword' || event.triggerSource === 'CustomMessage_ResendCode') {
      switch (event.request.userAttributes.locale.toLowerCase()) {
      case 'fr':
        event.response.emailSubject = '[Yapawa] Votre code de vérification'
        texts = [
          'Vous avez demandé de réinitialiser votre mot de passe. Si vous n\'avez pas initié cette demande, ignorez simplement ce message.',
          'Votre code de vérification est',
          'Saisissez ce code dans le champ correspondant du formulaire de réinitialisation du mot de passe.'
        ]
        event.response.emailMessage = template(texts, event.request.codeParameter)
        break
      case 'de':
        event.response.emailSubject = '[Yapawa] Ihr Bestätigungscode'
        texts = [
          'Sie haben angefordert Ihr Passwort zurückzusetzen. Wenn Sie diese Anforderung nicht initiiert haben, ignorieren Sie diese Nachricht einfach.',
          'Ihr Bestätigungscode ist',
          'Geben Sie diesen Code in das entsprechende Feld im Zurücksetzen des Passworts Formular ein.'
        ]
        event.response.emailMessage = template(texts, event.request.codeParameter)
        break
      default:
        event.response.emailSubject = '[Yapawa] Your verification code'
        texts = [
          'You have requested to reset your password. If you didn\'t initiate this request, just ignore this message.',
          'Your verification code is',
          'Enter this code in the relevant field on the reset password form.'
        ]
        event.response.emailMessage = template(texts, event.request.codeParameter)
        break
      }
    }
  }
  callback(null, event)
}
