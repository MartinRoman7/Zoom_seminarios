import smtplib
import sys
import time
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
#from email import Encoders

print ('Argument List:', str(sys.argv))

join_url= str(sys.argv[1])
fecha = str(sys.argv[2])
hora_minuto = str(sys.argv[3])
str_titulo = str(sys.argv[4])
str_descripcion = str(sys.argv[5])
duracion = str(sys.argv[6])
email = str(sys.argv[7])

titulo = str_titulo.replace('_',' ')
descripcion = str_descripcion.replace('_',' ')

fromaddr = 'Notificaciones Fundación Carlos Slim de la Salud'
toaddrs  = email

msg = MIMEMultipart()
msg['Subject'] = "Mensaje de confirmacion"
msg['From'] = fromaddr
msg['To'] = toaddrs

text = '<br><br><hr><h2>&#128276; Su seminario ha sido registrado</h2><hr><br><br><strong>&#128205; Seminario:</strong> '+titulo+'<br><strong>&#128221; Descripción:</strong> '+descripcion+'<br><strong>&#128347; Fecha y hora:</strong> '+fecha+' '+hora_minuto+'<br><br><br><strong>&#128279; Comparta el siguiente enlace de ZOOM con sus participantes:</strong> '+join_url+'<br><br><br><br><br><br><br><footer>No responder este mensaje</footer>'

msg.attach( MIMEText(text, 'html') )

username = 'alertas.FCS.salud@gmail.com'
password = 'Fund4c10nCS123'
server = smtplib.SMTP('smtp.gmail.com:587')
server.ehlo()
server.starttls()
server.login(username,password)
server.sendmail(fromaddr, toaddrs, msg.as_string())
server.quit()