with import <nixpkgs> {};

let

  NPM_GLOBAL_TEMPDIR="$(${mktemp.outPath}/bin/mktemp -d -t npm_XXXXXXX)";

in stdenv.mkDerivation {
  name = "plantuml-parser";

  src = null;

  buildInputs = [
    nodejs
  ];

  shellHook = ''
    export NPM_CONFIG_PREFIX=${NPM_GLOBAL_TEMPDIR}
    npm set prefix "${NPM_GLOBAL_TEMPDIR}/.npm-global"
  '';

  exitHook = ''
    rm -rf "${NPM_GLOBAL_TEMPDIR}"
  '';

}
