PROJECT=sidekick-rpg/module-hero

build:
	docker build -t "$(PROJECT)" .

node:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" node $(ARGS)

npm:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" npm $(ARGS)

shell:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" sh

test:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" npm run test

coverage:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" npm run coverage

.PHONY: test coverage
