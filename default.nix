with import <nixpkgs> {};

let

in stdenv.mkDerivation {
  name = "plantuml-parser";

  src = null;

  buildInputs = [
    nodejs-16_x
  ];

  shellHook = ''
    export NPM_CONFIG_PREFIX="$(${mktemp.outPath}/bin/mktemp -d -t npm_XXXXXXX)"
    export PATH="''${PATH}:''${NPM_CONFIG_PREFIX}/bin"
    npm set prefix "''${NPM_CONFIG_PREFIX}/.npm-global"
    npm install -g npm-check-updates
  '';

  exitHook = ''
    rm -rf ''${NPM_CONFIG_PREFIX}
  '';

}
