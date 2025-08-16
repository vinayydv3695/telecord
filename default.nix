{ pkgs ? import <nixpkgs> {}:

pkgs.stdenv.mkDerivation rec {
  pname = "telecord";
  version = "1.0.0";

  src = ./.;

  nativeBuildInputs = [ pkgs.makeWrapper ];
  buildInputs = [ pkgs.nodejs pkgs.npm ];

  buildPhase = ''
    runHook preBuild
    npm install --omit=dev
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    # Create the directory structure
    mkdir -p $out/lib/telecord
    mkdir -p $out/bin

    # Copy all the application files
    cp -r ./* $out/lib/telecord/

    # Create a wrapper script
    makeWrapper ${pkgs.nodejs}/bin/node $out/bin/telecord \
      --add-flags "$out/lib/telecord/bin/telecord.js"

    runHook postInstall
  '';

  meta = with pkgs.lib;
    {
      description = "A CLI tool to export Discord chats (with media) to Telegram.";
      homepage = "https://github.com/vinayydv3695/telecord";
      license = licenses.mit;
      maintainers = with maintainers; [ ]; # Add your handle here if you have one
      platforms = platforms.all;
    };
}

