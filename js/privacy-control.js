////
////    privacyControl - JS
////    V 1.2 by Louis Mudrack
////    07/27/2023
////
////////////////////

const cmToggle = {
  elementName: 'cookie-manager-toggler',
  className: 'closed',
  textContent: 'Manage Cookies',
};
const cmParent = {
  elementName: 'cookie-manager',
};

const cmChilds = [
  {
    elementName: 'cm-close',
    textContent: 'X',
  },
  {
    elementName: 'cm-info',
    childElements: [
      {
        elementName: 'cm-text',
        textContent:
          'Diese Website nutzt Cookies oder Drittanbieterdienste nur mit Ihrem Einverständnis - jederzeit wiederruflich und freiwillig!',
      },
      { elementName: 'cm-buttons', textContent: 'Alle akzeptieren' },
    ],
  },
  { elementName: 'cm-body' },
  {
    elementName: 'cm-footer',
    childElements: [
      {
        elementName: 'a',
        className: 'reset',
        textContent: 'zurücksetzen',
      },
      {
        elementName: 'a',
        className: 'legal',
        textContent: 'Impressum',
      },
      {
        elementName: 'a',
        className: 'privacy',
        textContent: 'Datenschutz',
      },
    ],
  },
];

class PrivacyControl {
  constructor(cookies = {}) {
    this.deps = [];
    this.initUI();
    this.setupEventListeners();
    this.createCookies(cookies);
  }

  initUI() {
    this.createNodes(cmToggle, [], document.body);
    this.createNodes(cmParent, cmChilds, document.body);
    this.cookieManager = document.querySelector('cookie-manager');
    this.cookieManagerToggler = document.querySelector(
      'cookie-manager-toggler'
    );
    this.cmClose = document.querySelector('cm-close');
    this.cmBody = document.querySelector('cm-body');
  }

  createNodes(parentConfig, childConfig, parentEle) {
    const { elementName, className, textContent } = parentConfig;
    let parent = document.createElement(elementName);
    if (className) {
      parent.classList.add(className);
    }
    if (textContent) {
      parent.textContent = textContent;
    }
    childConfig.forEach((config) => {
      const { elementName, className, textContent, childElements } = config;
      let childEle = document.createElement(elementName);
      if (className) {
        childEle.classList.add(className);
      }
      if (textContent) {
        childEle.textContent = textContent;
      }
      if (childElements) {
        this.createNodes(config, childElements, childEle);
      }
      parent.appendChild(childEle);
    });
    parentEle.appendChild(parent);
  }

  setupEventListeners() {
    this.cmClose.addEventListener('click', () => this.close());
    this.cookieManagerToggler.addEventListener('click', () => this.toggle());
  }

  close() {
    this.cookieManagerToggler.classList.add('closed');
    this.cookieManagerToggler.classList.remove('hide');
    this.cookieManager.classList.remove('opened');
  }

  open() {
    this.cookieManager.classList.add('opened');
    this.cookieManagerToggler.classList.add('hide');
    this.cookieManagerToggler.classList.remove('closed');
  }

  toggle() {
    if (this.cookieManagerToggler.classList.contains('closed')) {
      this.open();
    } else {
      this.close();
    }
  }

  createCookies(cookies) {
    for (const key in cookies) {
      if (cookies.hasOwnProperty(key)) {
        const newCookies = {
          cookies: cookies[key],
        };
        this.deps.push(newCookies);
      }
      for (const name in cookies[key]) {
        const cmRow = document.createElement('cm-row');
        this.cmBody.appendChild(cmRow);

        // Accept cookies checkbox
        const acceptLabel = document.createElement('label');
        acceptLabel.setAttribute('for', `privacy-ctrl:${name}`);
        const accept = document.createElement('input');
        accept.setAttribute('type', 'checkbox');
        accept.setAttribute('id', `privacy-ctrl:${name}`);
        accept.setAttribute('name', `${name}`);
        acceptLabel.appendChild(accept);
        cmRow.appendChild(acceptLabel);
        const acceptAll = document.querySelector('cm-buttons');
        acceptAll.addEventListener('click', () => {
          const checkboxes = document.querySelectorAll('input[type=checkbox]');
          checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
          });
        });

        // Name
        const cookieName = document.createElement('p');
        cookieName.textContent = 'Name:';
        cmRow.appendChild(cookieName);
        const cookie = document.createElement('p');
        cookie.textContent = cookies[key][name].name;
        cmRow.appendChild(cookie);

        // Provider
        const AnbieterH = document.createElement('p');
        AnbieterH.textContent = 'Anbieter:';
        cmRow.appendChild(AnbieterH);
        const Anbieter = document.createElement('p');
        Anbieter.textContent = cookies[key][name].provider;
        cmRow.appendChild(Anbieter);

        // Usecase
        const Verwendungszweck = document.createElement('p');
        Verwendungszweck.textContent = 'Verwendungszweck:';
        cmRow.appendChild(Verwendungszweck);
        const lang = document.createElement('p');
        lang.textContent = cookies[key][name].lang;
        cmRow.appendChild(lang);

        // privacy-policy link
        const privacy = document.createElement('p');
        privacy.textContent = 'Datenschutz:';
        cmRow.appendChild(privacy);
        const privacyLink = document.createElement('a');
        privacyLink.textContent = 'Link';
        privacyLink.setAttribute('href', cookies[key][name].privacy);
        privacyLink.setAttribute('title', cookies[key][name].privacy);
        privacyLink.setAttribute('target', '_blank');
        cmRow.appendChild(privacyLink);
        const links = document.querySelectorAll('cm-footer a');
        links.forEach((link) => {
          if (link.classList.contains('reset')) {
            link.addEventListener('click', () => {
              const checkboxes = document.querySelectorAll(
                'input[type=checkbox]'
              );
              checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
              });
            });
          } else if (link.classList.contains('legal')) {
            link.setAttribute('href', '/impressum');
            link.setAttribute('title', 'Impressum');
          } else if (link.classList.contains('privacy')) {
            link.setAttribute('href', '/datenschutzerklaerung');
            link.setAttribute('title', 'Datenschutzerklärung');
          }
        });

        // Add functionality to checkbox
        let elements = document.querySelectorAll(
          `iframe[data-cm-name="${name}"]`
        );
        let inputField = document.getElementById(`privacy-ctrl:${name}`);
        inputField.dispatchEvent(new Event('change'));

        inputField.addEventListener('change', () => {
          elements.forEach((ele) => {
            if (inputField.checked) {
              ele.setAttribute('data-cm-accept', 'true');
              const src = ele.getAttribute('data-cm-src');
              ele.setAttribute('src', src);
              document.cookie = `${name}=accepted; path=/`;
            } else {
              ele.setAttribute('data-cm-accept', 'false');
              ele.setAttribute('src', '/cookie-manager.placeholder.html');
              document.cookie = `${name}=denied; path=/`;
            }
          });
        });

        elements.forEach((ele) => {
          if (document.cookie.includes(`${name}=accepted`) === true) {
            inputField.checked = true;
          } else {
            inputField.checked = false;
          }
          inputField.dispatchEvent(new Event('change'));
          if (ele.getAttribute('data-cm-accept') === 'false') {
            ele.setAttribute('src', '/cookie-manager.placeholder.html');
            ele.addEventListener('load', () => {
              if (ele.src.startsWith(window.location.origin)) {
                ele.contentDocument.body.innerHTML =
                  ele.contentDocument.body.innerHTML.replace(/{{key}}/g, name);
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
                  btn.addEventListener('click', () => {
                    const src = ele.getAttribute('data-cm-src');
                    ele.setAttribute('src', src);
                    document.cookie = `${name}=accepted; path=/`;
                    inputField.checked = true;
                    inputField.dispatchEvent(new Event('change'));
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
