default:
	@DFLAGS="--linker=mold" dub run 

# The TS compiler is absolutely horrible at cold starts.
# Run this in one terminal and then open another. Pretend this isn't running.
the_watcher_watch:
	@tsc --watch

install:
	dub upgrade
	dub run raylib-d:install
