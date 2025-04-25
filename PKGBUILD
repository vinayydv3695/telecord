pkgname=telecord
pkgver=1.0.0
pkgrel=1
pkgdesc="CLI to export Discord chat (JSON+media) to Telegram"
arch=('any')
url="https://github.com/vinayydv3695/telecord"
license=('MIT')
depends=('nodejs')
makedepends=('npm')
source=("telecord-$pkgver.tar.gz")
md5sums=('SKIP')

build() {
  cd "$srcdir/telecord-$pkgver"
  npm install --omit=dev
}

package() {
  cd "$srcdir/telecord-$pkgver"
  install -d "$pkgdir/usr/lib/telecord"
  cp -r . "$pkgdir/usr/lib/telecord"

  install -Dm755 "$srcdir/telecord-$pkgver/bin/telecord.js" "$pkgdir/usr/bin/telecord"
}

