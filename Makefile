all:
	npx parcel build html/index.html --no-scope-hoist --dist-dir dist --public-url .

test:
	node tst/test.js

clean:
	rm -rf .parcel-cache
	rm -f dist/*
	rm -f $$(find . -name \*~)
