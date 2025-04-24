# PaperOS API Documentation

# Pre-Reqs

- Hugo Extended (in the Assets section, hidden under **show all**) \
  <https://github.com/gohugoio/hugo/releases>
- Go
    ```sh
    curl https://webi.sh/golang | sh
    ```
- Node
    ```sh
    curl https://webi.sh/node@lts | sh
    ```
- Hugo Extended Edition
    ```sh
    curl https://webi.sh/hugo-extended@0.146 | sh
    ```

# Dev Build

```sh
git clone https://github.com/paperos-labs/paperos-docs.git ./dev.paperos.com/
pushd ./dev.paperos.com/
npm clean-install
go mod download -modcacherw
hugo
```

## Live reload

```sh
hugo --buildDrafts server
```

- `baseurl` will be ignored
- Preview will be available at:
    - <http://localhost:1313/>

# Prod Build

`./config.toml`:

```toml
baseurl = "https://dev.paperos.com/"
```

```sh
hugo
```

## Deploy

1. install `sclient`
    ```sh
    curl https://webi.sh/sclient | sh
    ```
2. add `dev.paperos.com` to your ssh config

    ```sh
    mkdir -p ~/.ssh/

    echo '
    Host docs dev.paperos.com
        Hostname dev.paperos.com
        User app
        ProxyCommand sclient %h
    ' >> ~/.ssh/config

    chmod 0640 ~/.ssh/config
    ```

3. sync the local build to the server
    ```sh
    rsync -avhPz ./public/ dev.paperos.com:~/public/
    ```

# Modify

- the names of the files in `./content/` are arbitrary
    ```sh
    ./content/records.md
    ```
- styles can be overwritten in `./assets/`
    ```sh
    ./assets/scss/slate/docuapi_overrides.scss
    ```

# References

Build with [Hugo Extended Edition](https://webinstall.dev/hugo-extended) and [docuapi](https://github.com/bep/docuapi).

# Troubleshooting

```sh
go: warning: "all" matched no packages
```

You get this because `go.mod` is being used to manage theme dependencies, not to compile Go code. \
(there are no top-level Go files in the project)
