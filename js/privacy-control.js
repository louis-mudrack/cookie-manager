////
////    privacyControl - JS
////    V 1.1.1 by Louis Mudrack
////    06/30/2023
////
////////////////////

const cookieManagerToggler = document.createElement("cookie-manager-toggler");
const cookieManager = document.createElement("cookie-manager");
const cmInfo = document.createElement("cm-info");
const cmClose = document.createElement("cm-close");
const cmText = document.createElement("cm-text");
const cmButtons = document.createElement("cm-buttons");
const cmBody = document.createElement("cm-body");
const cmFooter = document.createElement("cm-footer");
const cmLinkZurueck = document.createElement("cm-link");
const cmLinkImpressum = document.createElement("cm-link");
const cmLinkDatenschutz = document.createElement("cm-link");

cookieManagerToggler.textContent = "Manage Cookies";
cookieManagerToggler.classList.add("closed");
document.body.appendChild(cookieManagerToggler);

cmText.textContent =
    "Diese Website nutzt Cookies oder Drittanbieterdienste nur mit Ihrem Einverständnis - jederzeit wiederruflich und freiwillig!";
cmButtons.textContent = "Alle akzeptieren";
cmClose.textContent = "x";
cmInfo.appendChild(cmText);
cmInfo.appendChild(cmButtons);
cmFooter.appendChild(cmLinkZurueck);
cmFooter.appendChild(cmLinkImpressum);
cmFooter.appendChild(cmLinkDatenschutz);
cookieManager.appendChild(cmClose);
cookieManager.appendChild(cmInfo);
cookieManager.appendChild(cmBody);
cookieManager.appendChild(cmFooter);
document.body.appendChild(cookieManager);

let close = function () {
    cookieManagerToggler.classList.add("closed");
    cookieManagerToggler.classList.remove("hide");
    cookieManager.classList.remove("opened");
};
let open = function () {
    cookieManager.classList.add("opened");
    cookieManagerToggler.classList.add("hide");
    cookieManagerToggler.classList.remove("closed");
};

cmClose.addEventListener("click", function () {
    close();
});

cookieManagerToggler.addEventListener("click", function () {
    if (cookieManagerToggler.classList.contains("closed")) {
        open();
    } else {
        close();
    }
});

class privacyControl {
    constructor(cookies = {}) {
        this.deps = [];
        for (const key in cookies) {
            if (cookies.hasOwnProperty(key)) {
                const newCookies = {
                    cookies: cookies[key],
                };
                this.deps.push(newCookies);
            }
            for (const name in cookies[key]) {
                const cmRow = document.createElement("cm-row");
                cmBody.appendChild(cmRow);
                // accept cookies
                const acceptLabel = document.createElement("label");
                acceptLabel.setAttribute("for", `privacy-ctrl:${name}`);
                const accept = document.createElement("input");
                accept.setAttribute("type", "checkbox");
                accept.setAttribute("id", `privacy-ctrl:${name}`);
                accept.setAttribute("name", `${name}`);
                acceptLabel.appendChild(accept);
                cmRow.appendChild(acceptLabel);

                // Name

                const cookieName = document.createElement("p");
                cookieName.textContent = "Name:";
                cmRow.appendChild(cookieName);
                const cookie = document.createElement("p");
                cookie.textContent = cookies[key][name].name;
                cmRow.appendChild(cookie);

                // Provider

                const AnbieterH = document.createElement("p");
                AnbieterH.textContent = "Anbieter:";
                cmRow.appendChild(AnbieterH);
                const Anbieter = document.createElement("p");
                Anbieter.textContent = cookies[key][name].provider;
                cmRow.appendChild(Anbieter);

                // Usecase

                const Verwendungszweck = document.createElement("p");
                Verwendungszweck.textContent = "Verwendungszweck:";
                cmRow.appendChild(Verwendungszweck);
                const lang = document.createElement("p");
                lang.textContent = cookies[key][name].lang;
                cmRow.appendChild(lang);

                // privacy-policy link

                const privacy = document.createElement("p");
                privacy.textContent = "Datenschutz:";
                cmRow.appendChild(privacy);
                const privacyLink = document.createElement("a");
                privacyLink.textContent = "Link";
                privacyLink.setAttribute("href", cookies[key][name].privacy);
                privacyLink.setAttribute("title", cookies[key][name].privacy);
                privacyLink.setAttribute("target", "_blank");
                cmRow.appendChild(privacyLink);
                // add functionality to checkbox
                let elements = document.querySelectorAll(
                    `iframe[data-cm-name="${name}"]`
                );
                let inputField = document.getElementById(
                    `privacy-ctrl:${name}`
                );

                inputField.addEventListener("change", function () {
                    elements.forEach((ele) => {
                        if (inputField.checked) {
                            ele.setAttribute("data-cm-accept", "true");
                        } else {
                            ele.setAttribute("data-cm-accept", "false");
                            ele.setAttribute(
                                "src",
                                "/cookie-manager.placeholder.html"
                            );
                            ele.addEventListener("load", function () {
                                if (ele.src.startsWith(window.location.origin)) {
                                ele.contentDocument.body.innerHTML =
                                    ele.contentDocument.body.innerHTML.replace(
                                        /{{key}}/g,
                                        name
                                    );
                                ele.contentDocument.body.innerHTML =
                                    ele.contentDocument.body.innerHTML.replace(
                                        /{{name}}/g,
                                        cookies[key][name].name
                                    );
                                ele.contentDocument.body.innerHTML =
                                    ele.contentDocument.body.innerHTML.replace(
                                        /{{provider}}/g,
                                        cookies[key][name].provider
                                    );
                                ele.contentDocument.body.innerHTML =
                                    ele.contentDocument.body.innerHTML.replace(
                                        /{{desc}}/g,
                                        cookies[key][name].lang
                                    );
                                ele.contentDocument.body.innerHTML =
                                    ele.contentDocument.body.innerHTML.replace(
                                        /{{policy}}/g,
                                        cookies[key][name].privacy
                                    );
                                    let button = ele.contentDocument.querySelectorAll(
                                        `span[data-key="${name}"]`
                                    );
                                    button.forEach((btn) => {
                                        btn.addEventListener("click", function () {
                                            const src = ele.getAttribute("data-cm-src");
                                            ele.setAttribute("src", src);
                                            document.cookie = `${name}=accepted`;
                                            inputField.checked = true;
                                            inputField.dispatchEvent(
                                                new Event("change")
                                            );
                                        });
                                    });
                                }
                            });
                        }
                        if (ele.getAttribute("data-cm-accept") == "true") {
                            const src = ele.getAttribute("data-cm-src");
                            ele.setAttribute("src", src);
                            document.cookie = `${name}=accepted`;
                        } else {
                            ele.setAttribute(
                                "src",
                                "/cookie-manager.placeholder.html"
                            );
                            document.cookie = `${name}=denied`;
                        }
                    });
                });
                elements.forEach((ele) => {
                    if (document.cookie.includes(`${name}=accepted`) === true) {
                        inputField.checked = true;
                        inputField.dispatchEvent(new Event("change"));
                    } else {
                        inputField.checked = false;
                        inputField.dispatchEvent(new Event("change"));
                    }
                    if (ele.getAttribute("data-cm-accept") === "false") {
                        ele.setAttribute(
                            "src",
                            "/cookie-manager.placeholder.html"
                        );
                        ele.addEventListener("load", function () {
                            if (ele.src.startsWith(window.location.origin)) {
                            ele.contentDocument.body.innerHTML =
                                ele.contentDocument.body.innerHTML.replace(
                                    /{{key}}/g,
                                    name
                                );
                            ele.contentDocument.body.innerHTML =
                                ele.contentDocument.body.innerHTML.replace(
                                    /{{name}}/g,
                                    cookies[key][name].name
                                );
                            ele.contentDocument.body.innerHTML =
                                ele.contentDocument.body.innerHTML.replace(
                                    /{{provider}}/g,
                                    cookies[key][name].provider
                                );
                            ele.contentDocument.body.innerHTML =
                                ele.contentDocument.body.innerHTML.replace(
                                    /{{desc}}/g,
                                    cookies[key][name].lang
                                );
                            ele.contentDocument.body.innerHTML =
                                ele.contentDocument.body.innerHTML.replace(
                                    /{{policy}}/g,
                                    cookies[key][name].privacy
                                );
                            let button = ele.contentDocument.querySelectorAll(
                                `span[data-key="${name}"]`
                            );
                            button.forEach((btn) => {
                                btn.addEventListener("click", function () {
                                    const src = ele.getAttribute("data-cm-src");
                                    ele.setAttribute("src", src);
                                    document.cookie = `${name}=accepted`;
                                    inputField.checked = true;
                                    inputField.dispatchEvent(
                                        new Event("change")
                                    );
                                });
                            });
                        }
                        });
                    }
                });
            }
        }
    }
}
