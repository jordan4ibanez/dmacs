default:
	@./dmacs

rebuild:
	@DFLAGS="--linker=mold" dub run 

# The TS compiler is absolutely horrible at cold starts.
# Run this in one terminal and then open another. Pretend this isn't running.
watch:
	@webpack watch

install:
	dub upgrade
	dub run raylib-d:install
