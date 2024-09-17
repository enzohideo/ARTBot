{
  description = "ART Bot";

  outputs =
    {
      self,
      nixpkgs,
      systems,
      ...
    }@inputs:
    let
      inherit (nixpkgs) lib;
      eachSystem = lib.genAttrs (import systems);
      pkgsFor = eachSystem (system: nixpkgs.legacyPackages.${system});
    in
    {
      devShell = eachSystem (
        system:
        let
          pkgs = pkgsFor.${system};
        in
        pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            nodePackages.npm
          ];
        }
      );
    };
}
