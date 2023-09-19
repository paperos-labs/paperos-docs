# PaperOS API Documentation

# Pre-Reqs

-   Hugo Extended (in the Assets section, hidden under **show all**) \
    <https://github.com/gohugoio/hugo/releases>
-   Go
    ```sh
    curl https://webi.sh/golang | sh
    ```
-   Node
    ```sh
    curl https://webi.sh/node | sh
    ```
-   Hugo Extended Edition
    ```sh
    curl https://webi.sh/hugo-extended | sh
    ```

# Build

```sh
git clone https://github.com/savvi-legal/docs.git ./dev.paperos.com/
pushd ./dev.paperos.com/
npm ci
go mod download -modcacherw
hugo
```

## Live reload

```sh
hugo --buildDrafts server
```

-   `baseurl` will be ignored
-   Preview will be available at:
    -   <http://localhost:1313/>

# Modify

-   the names of the files in `./content/` are arbitrary
    ```sh
    ./content/resources.md
    ```
-   styles can be overwritten in `./assets/`
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
