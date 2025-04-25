pkgname=telecord
pkgver=1.0.0
pkgrel=1
pkgdesc="CLI to export Discord chat (JSON + media) to Telegram"
arch=('any')
url="https://github.com/vinayydv3695/telecord"
license=('MIT')
depends=('nodejs')
makedepends=('npm')

build() {
  cd "$srcdir"
  npm install --omit=dev
}

package() {
  install -d "$pkgdir/usr/lib/telecord"
  cp -r . "$pkgdir/usr/lib/telecord"

  install -Dm755 "$srcdir/bin/telecord.js" "$pkgdir/usr/bin/telecord"
}

