const fs = require("fs");
const path = require("path");

const pages = require("./pages/pages.js");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

const MASTER_TEMPLATE =
    fs.readFileSync(
        path.join(
            ROOT,
            "templates",
            "game-layout.html"
        ),
        "utf8"
    );


function replaceAll(
    html,
    placeholder,
    value
) {
    return html
        .split(placeholder)
        .join(value);
}


function makeSkillsList(
    skills
) {
    const items =
        skills
            .map(
                skill =>
                    `        <li>${skill}</li>`
            )
            .join("\n");

    return (
        `<ul>\n${items}\n      </ul>`
    );
}


function copy(
    source,
    destination
) {
    const stat =
        fs.statSync(source);

    if (
        stat.isDirectory()
    ) {
        fs.mkdirSync(
            destination,
            {
                recursive: true
            }
        );

        for (
            const item
            of fs.readdirSync(source)
        ) {
            copy(
                path.join(source, item),
                path.join(destination, item)
            );
        }

        return;
    }

    fs.mkdirSync(
        path.dirname(destination),
        {
            recursive: true
        }
    );

    fs.copyFileSync(
        source,
        destination
    );
}


function buildMasterGame(
    slug,
    config
) {
    const contentPath =
        path.join(
            ROOT,
            "pages",
            `${slug}.html`
        );

    const gameContent =
        fs.readFileSync(
            contentPath,
            "utf8"
        );

    let html =
        MASTER_TEMPLATE;


    html =
        replaceAll(
            html,
            "{{SEO_TITLE}}",
            config.seoTitle
        );


    html =
        replaceAll(
            html,
            "{{SEO_DESCRIPTION}}",
            config.seoDescription
        );


    html =
        replaceAll(
            html,
            "{{GAME_ICON}}",
            config.icon
        );


    html =
        replaceAll(
            html,
            "{{GAME_TITLE}}",
            config.gameTitle
        );

    html =
        replaceAll(
            html,
            "{{GAME_SLUG}}",
            slug
        );

    html =
        replaceAll(
            html,
            "{{AGE_RANGE}}",
            config.ageRange
        );


    html =
        replaceAll(
            html,
            "{{GAME_CONTENT}}",
            gameContent
        );


    html =
        replaceAll(
            html,
            "{{PARENT_HEADING}}",
            config.parentHeading
        );


    html =
        replaceAll(
            html,
            "{{PARENT_DESCRIPTION}}",
            config.parentDescription
        );


    html =
        replaceAll(
            html,
            "{{SKILLS_LIST}}",
            makeSkillsList(
                config.skills
            )
        );


    const outputFolder =
        path.join(
            DIST,
            "games",
            slug
        );


    fs.mkdirSync(
        outputFolder,
        {
            recursive: true
        }
    );


    fs.writeFileSync(
        path.join(
            outputFolder,
            "index.html"
        ),
        html
    );


    /*
      Keep the existing proven game logic.
    */

    const gameJS =
        path.join(
            ROOT,
            "games",
            slug,
            "game.js"
        );


    if (
        fs.existsSync(gameJS)
    ) {
        fs.copyFileSync(
            gameJS,
            path.join(
                outputFolder,
                "game.js"
            )
        );
    }


    console.log(
        `Master-built: ${slug}`
    );
}


/* ========================================
   CLEAN DIST
======================================== */

fs.rmSync(
    DIST,
    {
        recursive: true,
        force: true
    }
);


fs.mkdirSync(
    DIST,
    {
        recursive: true
    }
);


/* ========================================
   COPY SHARED SITE FILES
======================================== */

const SHARED_ITEMS = [
    "index.html",
    "css",
    "js",
    "assets",
    "robots.txt",
    "sitemap.xml"
];


for (
    const item
    of SHARED_ITEMS
) {
    const source =
        path.join(
            ROOT,
            item
        );

    if (
        fs.existsSync(source)
    ) {
        copy(
            source,
            path.join(
                DIST,
                item
            )
        );
    }
}


/* ========================================
   COPY EXISTING GAMES
   EXCEPT MASTER-MIGRATED ONES
======================================== */

const gamesSource =
    path.join(
        ROOT,
        "games"
    );


const gamesDestination =
    path.join(
        DIST,
        "games"
    );


const MASTER_GAMES = [
    "find-the-color",
    "colored-objects",
    "find-the-letter",
    "find-the-animal",
    "bubble-pop",
    "find-the-shape",
    "count-and-cross"
];


if (
    fs.existsSync(gamesSource)
) {

    fs.mkdirSync(
        gamesDestination,
        {
            recursive: true
        }
    );


    for (
        const gameFolder
        of fs.readdirSync(gamesSource)
    ) {

        if (
            MASTER_GAMES.includes(
                gameFolder
            )
        ) {
            continue;
        }


        copy(
            path.join(
                gamesSource,
                gameFolder
            ),

            path.join(
                gamesDestination,
                gameFolder
            )
        );

    }

}


/* ========================================
   BUILD MASTER-TEMPLATE GAMES
======================================== */

for (
    const slug
    of MASTER_GAMES
) {

    const config =
        pages[slug];


    if (
        !config
    ) {
        throw new Error(
            `Missing page config for ${slug}`
        );
    }


    buildMasterGame(
        slug,
        config
    );

}


/* ========================================
   COMPLETE
======================================== */

console.log("");
console.log(
    "Build complete: dist/"
);

console.log(
    "Master games:",
    MASTER_GAMES.join(", ")
);

