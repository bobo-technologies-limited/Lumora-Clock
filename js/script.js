/*
============================================================
LUMORA CLOCK
Aesthetic Digital Clock for Notion
Designed & Developed by Bobo Technologies Limited
============================================================
*/


/* ==========================================================
   ELEMENTS
   ========================================================== */

const timeElement =
    document.getElementById("time");

const secondsElement =
    document.getElementById("seconds");

const ampmElement =
    document.getElementById("ampm");

const dayElement =
    document.getElementById("day");

const dateElement =
    document.getElementById("date");

const settingsButton =
    document.getElementById("settingsButton");

const settingsPanel =
    document.getElementById("settingsPanel");

const closeSettings =
    document.getElementById("closeSettings");

const secondsToggle =
    document.getElementById("secondsToggle");

const clockCard =
    document.getElementById("clockCard");


/* ==========================================================
   DEFAULT SETTINGS
   ========================================================== */

const defaultSettings = {

    format: "12",

    showSeconds: true,

    theme: "auto",

    mode: "normal"
};


/* ==========================================================
   SETTINGS
   ========================================================== */

let settings = {
    ...defaultSettings
};


/* ==========================================================
   LOAD SETTINGS
   ========================================================== */

function loadSettings() {

    try {

        const saved =
            localStorage.getItem(
                "lumoraClockSettings"
            );

        if (saved) {

            settings = {
                ...defaultSettings,
                ...JSON.parse(saved)
            };
        }

    } catch (error) {

        console.warn(
            "Lumora Clock: Could not load settings.",
            error
        );
    }
}


/* ==========================================================
   SAVE SETTINGS
   ========================================================== */

function saveSettings() {

    try {

        localStorage.setItem(
            "lumoraClockSettings",
            JSON.stringify(settings)
        );

    } catch (error) {

        console.warn(
            "Lumora Clock: Could not save settings.",
            error
        );
    }
}


/* ==========================================================
   FORMAT TIME
   ========================================================== */

function formatTime(date) {

    let hours =
        date.getHours();

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");


    let ampm = "";


    if (settings.format === "12") {

        ampm =
            hours >= 12
                ? "PM"
                : "AM";

        hours =
            hours % 12 || 12;

    }


    hours =
        String(hours)
            .padStart(2, "0");


    return {

        hours,

        minutes,

        seconds,

        ampm
    };
}


/* ==========================================================
   UPDATE CLOCK
   ========================================================== */

function updateClock() {

    const now =
        new Date();


    const formatted =
        formatTime(now);


    timeElement.textContent =
        `${formatted.hours}:${formatted.minutes}`;


    secondsElement.textContent =
        `:${formatted.seconds}`;


    ampmElement.textContent =
        formatted.ampm;


    if (settings.format === "24") {

        ampmElement.style.opacity = "0";

    } else {

        ampmElement.style.opacity = "1";
    }


    if (settings.showSeconds) {

        secondsElement.style.display =
            "block";

    } else {

        secondsElement.style.display =
            "none";
    }


    updateDate(now);


    /* Small animation on each minute/second update */

    timeElement.classList.remove("tick");

    void timeElement.offsetWidth;

    timeElement.classList.add("tick");
}


/* ==========================================================
   UPDATE DATE
   ========================================================== */

function updateDate(date) {

    const day =
        new Intl.DateTimeFormat(
            undefined,
            {
                weekday: "long"
            }
        ).format(date);


    const formattedDate =
        new Intl.DateTimeFormat(
            undefined,
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        ).format(date);


    dayElement.textContent =
        day;


    dateElement.textContent =
        formattedDate;
}


/* ==========================================================
   OPEN SETTINGS
   ========================================================== */

function openSettings() {

    settingsPanel.classList.add("active");

    settingsPanel.setAttribute(
        "aria-hidden",
        "false"
    );

    settingsButton.setAttribute(
        "aria-expanded",
        "true"
    );
}


/* ==========================================================
   CLOSE SETTINGS
   ========================================================== */

function closeSettingsPanel() {

    settingsPanel.classList.remove("active");

    settingsPanel.setAttribute(
        "aria-hidden",
        "true"
    );

    settingsButton.setAttribute(
        "aria-expanded",
        "false"
    );
}


/* ==========================================================
   TIME FORMAT
   ========================================================== */

function updateFormat(format) {

    settings.format =
        format;

    updateClock();

    saveSettings();

    updateActiveButtons();
}


/* ==========================================================
   SECONDS
   ========================================================== */

function updateSeconds(show) {

    settings.showSeconds =
        show;

    updateClock();

    saveSettings();
}


/* ==========================================================
   THEME
   ========================================================== */

function applyTheme(theme) {

    settings.theme =
        theme;


    if (theme === "auto") {

        applyAutomaticTheme();

    } else {

        document.body.dataset.theme =
            theme;
    }


    saveSettings();

    updateActiveButtons();
}


/* ==========================================================
   AUTOMATIC THEME
   ========================================================== */

function applyAutomaticTheme() {

    const darkMode =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    document.body.dataset.theme =
        darkMode
            ? "midnight"
            : "cloud";
}


/* ==========================================================
   DISPLAY MODE
   ========================================================== */

function applyMode(mode) {

    settings.mode =
        mode;


    document.body.classList.toggle(
        "minimal-mode",
        mode === "minimal"
    );


    document.body.classList.toggle(
        "glass-mode",
        mode === "glass"
    );


    saveSettings();

    updateActiveButtons();
}


/* ==========================================================
   ACTIVE BUTTON STATES
   ========================================================== */

function updateActiveButtons() {

    document
        .querySelectorAll(
            "[data-format]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.format ===
                    settings.format
            );
        });


    document
        .querySelectorAll(
            "[data-mode]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.mode ===
                    settings.mode
            );
        });


    document
        .querySelectorAll(
            "[data-theme]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.theme ===
                    settings.theme
            );
        });


    secondsToggle.checked =
        settings.showSeconds;
}


/* ==========================================================
   EVENT LISTENERS
   ========================================================== */


/* Settings */

settingsButton.addEventListener(
    "click",
    openSettings
);


closeSettings.addEventListener(
    "click",
    closeSettingsPanel
);


/* Format */

document
    .querySelectorAll(
        "[data-format]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                updateFormat(
                    button.dataset.format
                );
            }
        );
    });


/* Seconds */

secondsToggle.addEventListener(
    "change",
    () => {

        updateSeconds(
            secondsToggle.checked
        );
    }
);


/* Themes */

document
    .querySelectorAll(
        "[data-theme]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                applyTheme(
                    button.dataset.theme
                );
            }
        );
    });


/* Display modes */

document
    .querySelectorAll(
        "[data-mode]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                applyMode(
                    button.dataset.mode
                );
            }
        );
    });


/* Close settings with Escape */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeSettingsPanel();
        }
    }
);


/* ==========================================================
   AUTOMATIC THEME LISTENER
   ========================================================== */

const systemTheme =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


systemTheme.addEventListener(
    "change",
    () => {

        if (
            settings.theme === "auto"
        ) {

            applyAutomaticTheme();
        }
    }
);


/* ==========================================================
   INITIALIZE
   ========================================================== */

function initializeClock() {

    loadSettings();

    updateClock();

    applyMode(
        settings.mode
    );

    applyTheme(
        settings.theme
    );

    updateActiveButtons();
}


/* ==========================================================
   START
   ========================================================== */

initializeClock();


/*
============================================================
LUMORA CLOCK
Made By Bobo Technologies Limited
============================================================
*/
