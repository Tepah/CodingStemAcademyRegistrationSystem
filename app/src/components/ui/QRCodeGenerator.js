import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

function QRCodeGenerator({ text, props }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, {
        width: 128,
        margin: 2
      }, (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        setQrCodeUrl(url);
      });
    }
  }, [text]);

  return (
    <div {...props}>
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="QR Code" />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
}

export default QRCodeGenerator;