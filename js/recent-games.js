(() => {

  const STORAGE_KEY =
    "little-learners-recent-games";


  const GAME_CATALOG = [
    {
      slug: "find-the-color",
      title: "Find the Color",
      icon: "🎨",
      url: "/games/find-the-color/"
    },

    {
      slug: "colored-objects",
      title: "Colored Objects",
      icon: "🎈",
      url: "/games/colored-objects/"
    },

    {
      slug: "find-the-letter",
      title: "Find the Letter",
      icon: "🔤",
      url: "/games/find-the-letter/"
    },

    {
      slug: "find-the-animal",
      title: "Find the Animal",
      icon: "🐶",
      url: "/games/find-the-animal/"
    },
    {
      slug: "bubble-pop",
      title: "Bubble Pop",
      icon: "🫧",
      url: "/games/bubble-pop/"
    },
    {
      slug: "find-the-shape",
      title: "Find the Shape",
      icon: "🎁",
      url: "/games/find-the-shape/"
    }
  ];


  const recentGamesPanel =
    document.getElementById(
      "recentGamesPanel"
    );


  const recentGamesList =
    document.getElementById(
      "recentGamesList"
    );


  const openRecentGames =
    document.getElementById(
      "openRecentGames"
    );


  const closeRecentGames =
    document.getElementById(
      "closeRecentGames"
    );


  if (
    !recentGamesPanel ||
    !recentGamesList
  ) {
    return;
  }


  function getCurrentSlug() {

    const match =
      window.location.pathname.match(
        /\/games\/([^/]+)/
      );


    return (
      match
        ? match[1]
        : null
    );
  }


  function readRecentGames() {

    try {

      const stored =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          )
        );


      if (
        Array.isArray(stored)
      ) {

        return stored;

      }

    } catch (error) {

      console.warn(
        "Could not read recent games.",
        error
      );

    }


    return [];
  }


  function saveRecentGames(
    games
  ) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(games)
      );

    } catch (error) {

      console.warn(
        "Could not save recent games.",
        error
      );

    }

  }


  function recordCurrentGame() {

    const currentSlug =
      getCurrentSlug();


    if (
      !currentSlug
    ) {
      return;
    }


    let recent =
      readRecentGames();


    recent =
      recent.filter(
        slug =>
          slug !==
          currentSlug
      );


    recent.unshift(
      currentSlug
    );


    recent =
      recent.slice(
        0,
        4
      );


    saveRecentGames(
      recent
    );

  }


  function getOrderedGames() {

    const currentSlug =
      getCurrentSlug();


    const recent =
      readRecentGames();


    const result = [];


    /*
      Recently played first,
      but don't show current game.
    */

    recent.forEach(
      slug => {

        const game =
          GAME_CATALOG.find(
            item =>
              item.slug === slug
          );


        if (
          game &&
          game.slug !== currentSlug
        ) {

          result.push({
            ...game,
            recent: true
          });

        }

      }
    );


    /*
      Then fill with other available games.
    */

    GAME_CATALOG.forEach(
      game => {

        const alreadyIncluded =
          result.some(
            item =>
              item.slug ===
              game.slug
          );


        if (
          game.slug !==
          currentSlug &&
          !alreadyIncluded
        ) {

          result.push({
            ...game,
            recent: false
          });

        }

      }
    );


    return result.slice(
      0,
      4
    );

  }


  function renderGames() {

    const games =
      getOrderedGames();


    recentGamesList.innerHTML =
      "";


    games.forEach(
      game => {

        const link =
          document.createElement(
            "a"
          );


        link.className =
          "recent-game-link";


        link.href =
          game.url;


        const icon =
          document.createElement(
            "span"
          );


        icon.className =
          "recent-game-icon";


        icon.textContent =
          game.icon;


        const copy =
          document.createElement(
            "span"
          );


        copy.className =
          "recent-game-copy";


        const title =
          document.createElement(
            "span"
          );


        title.className =
          "recent-game-title";


        title.textContent =
          game.title;


        const status =
          document.createElement(
            "span"
          );


        status.className =
          "recent-game-status";


        status.textContent =
          game.recent
            ? "Played recently"
            : "Try this game";


        copy.appendChild(
          title
        );


        copy.appendChild(
          status
        );


        link.appendChild(
          icon
        );


        link.appendChild(
          copy
        );


        recentGamesList
          .appendChild(
            link
          );

      }
    );

  }


  function openPanel() {

    recentGamesPanel
      .classList
      .add(
        "is-mobile-open"
      );

  }


  function closePanel() {

    recentGamesPanel
      .classList
      .remove(
        "is-mobile-open"
      );

  }


  if (
    openRecentGames
  ) {

    openRecentGames
      .addEventListener(
        "click",
        openPanel
      );

  }


  if (
    closeRecentGames
  ) {

    closeRecentGames
      .addEventListener(
        "click",
        closePanel
      );

  }


  recordCurrentGame();

  renderGames();

})();