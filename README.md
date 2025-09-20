# Chroma Explorer

Online tool to explore the contents of a Chroma database.


## Getting started

### Development

Use this command to run the site locally for development:

```sh
docker compose watch
# or: docker compose up -d
```

Using `watch`, you'll benefit from file changes watching for sync & rebuild.

Use [DockerC](https://github.com/matiboux/dockerc) for shortened commands: `dockerc - @w`.

The site will be available at [http://localhost:8080](http://localhost:8080).

### Production

Use this command to run the site locally for production:

```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# or: docker compose -f docker-compose.yml up -d
```

Use [DockerC](https://github.com/matiboux/dockerc) for shortened commands: `dockerc prod`.

The site will be available at [http://localhost:8080](http://localhost:8080).


## License

Copyright (c) 2024 [Matiboux](https://github.com/matiboux) ([matiboux.me](https://matiboux.me))

Licensed under the [MIT License](https://opensource.org/licenses/MIT). You can see a copy in the [LICENSE](LICENSE) file.
