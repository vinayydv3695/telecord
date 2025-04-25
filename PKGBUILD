# Maintainer: Vinay <vinayydv343@gmail.com>
pkgname=telecord
pkgver=1.0.0
pkgrel=1
pkgdesc="Export Discord chat JSONs (with media) to Telegram in a clean format"
arch=('any')
url="https://github.com/vinayydv3695/telecord"
license=('MIT')
depends=('nodejs' 'npm')
source=("$pkgname-$pkgver.tar.gz::$url/archive/refs/tags/v$pkgver.tar.gz")
sha256sums=('SKIP')  # Replace with real checksum for production

build() {
  cd "$srcdir/$pkgname-$pkgver"
  npm install
}

package() {
  cd "$srcdir/$pkgname-$pkgver"
  install -Dm755 bin/telecord.js "$pkgdir/usr/bin/telecord"
}

