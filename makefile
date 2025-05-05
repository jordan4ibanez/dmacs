default:
	@DFLAGS="--linker=mold" dub run --build=debug
# @./dmacs

install:
	dub upgrade
	dub run raylib-d:install
