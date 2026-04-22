describe("Navigation", () => {
    it("Should navigate to the login page", () => {
        cy.visit("http://localhost:3000/");
        cy.get('a[href*="login"]').click();
        cy.url().should("include", "/login");
        cy.get("h2").contains("Bienvenue");
    });
    it("Should navigate to the register page", () => {
        cy.visit("http://localhost:3000/");
        cy.get('a[href*="register"]').click();
        cy.url().should("include", "/register");
        cy.get("h2").contains("Créer un compte");
    });
});

describe("User CRUD Flow", () => {
    const testId = Date.now();
    const user = {
        firstName: "Test",
        lastName: "Utilisateur",
        email: `${testId}@example.com`,
        password: "password123",
        dob: "1990-01-01",
        newFirstName: "Test-Modifié",
    };

    it("should register, login, update, and delete a new user", () => {
        cy.visit("http://localhost:3000/register");

        cy.get('input[id="firstname"]').type(user.firstName);
        cy.get('input[id="lastname"]').type(user.lastName);
        cy.get('input[id="email"]').type(user.email);
        cy.get('input[id="password"]').type(user.password);
        cy.get('input[id="dob"]').type(user.dob);
        cy.get("form").submit();

        cy.wait(1000);
        cy.url().should("include", "/login");
        cy.get("h2").contains("Bienvenue");

        cy.login(user.email, user.password);

        cy.visit("http://localhost:3000/");
        cy.get("header").contains(user.firstName);

        cy.get("button").contains("Profil").click({ force: true });
        cy.wait(1000);
        cy.url().should("include", "/profil/");

        cy.get("h1").contains(`${user.firstName} ${user.lastName}`);
        cy.contains(user.email);

        cy.contains("Éditer le profil").click();
        cy.wait(1000);
        cy.url().should("include", "/profil/edit/");

        cy.get('input[value="' + user.firstName + '"]')
            .clear()
            .type(user.newFirstName);
        cy.get("button").contains("Enregistrer").click();
        cy.wait(1000);
        cy.get("header").contains("Accueil").click();

        cy.wait(1000);

        cy.get("button").contains("Profil").click({ force: true });

        cy.wait(1000);

        cy.url().should("include", "/profil/");

        cy.get("h1").contains(user.newFirstName);

        cy.contains("Éditer le profil").click();

        cy.on("window:confirm", (str) => {
            expect(str).to.equal("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
            return true;
        });

        cy.get("button").contains("Supprimer le compte").click();

        cy.wait(1000);

        cy.url().should("eq", "http://localhost:3000/");
        cy.wait(1000);
        cy.visit("http://localhost:3000/login");
        cy.get('input[id="email"]').type(user.email);
        cy.get('input[id="password"]').type(user.password);
        cy.get("form").submit();

        cy.url().should("include", "/login");
    });
});

describe("Annonce CRUD Flow (as Agent)", () => {
    const testId = Date.now();
    const annonce = {
        title: `Test Annonce ${testId}`,
        description: "Description de test pour cette annonce.",
        price: "250000",
        address: "123 Rue Cypress",
        city: "Le Havre",
        country: "France",
        postalCode: "76600",
        surface: "75",
        rooms: "3",
        bathrooms: "1",
        floor: "2",
        year: "1998",
        date: "2025-01-01",
        newTitle: `Test Annonce Modifiée ${testId}`,
    };
    let annonceId = null; // Pour stocker l'ID de l'annonce créée

    beforeEach(() => {
        cy.login("agent@example.com", "12345");
    });

    it("should create, read, update, and delete an annonce", () => {
        cy.visit("http://localhost:3000/annonces/add");
        cy.url().should("include", "/annonces/add");

        cy.get('input[id="title"]').type(annonce.title);
        cy.get('input[id="address"]').type(annonce.address);
        cy.get('input[id="city"]').type(annonce.city);
        cy.get('input[id="country"]').type(annonce.country);
        cy.get('input[id="postalCode"]').type(annonce.postalCode);
        cy.get('textarea[id="description"]').type(annonce.description);
        cy.get('input[id="price"]').type(annonce.price);
        cy.get('input[id="surface"]').type(annonce.surface);
        cy.get('input[id="rooms"]').type(annonce.rooms);
        cy.get('input[id="bathrooms"]').type(annonce.bathrooms);
        cy.get('input[id="floor"]').type(annonce.floor);
        cy.get('input[id="yearBuilt"]').type(annonce.year);
        cy.get('input[id="avaibleFrom"]').type(annonce.date);
        cy.get('select[id="type"]').select("SALE");
        cy.get('select[id="reStatus"]').select("FORSALE");
        cy.get('select[id="publicationStatus"]').select("PUBLISHED");
        cy.get('input[type="file"]').selectFile("cypress/fixtures/test-image.jpg", { force: true });
        cy.contains("test-image.jpg");
        cy.get("button").contains("Ajouter l'annonce").click();

        cy.url().should("eq", "http://localhost:3000/");
        cy.wait(1000);

        // --- READ ---
        cy.contains("h3", annonce.title)
            .closest(".group.relative")
            .find('a[href*="/annonces/"]')
            .invoke("attr", "href")
            .then((href) => {
                // -- DEBUT DU BLOC .THEN() --

                annonceId = href.split("/").pop();
                cy.log(`Annonce créée avec ID: ${annonceId}`);

                cy.contains("h3", annonce.title).closest(".group.relative").find('a[href*="/annonces/"]').click();

                cy.url().should("include", `/annonces/${annonceId}`);
                cy.get("h1").contains(annonce.title);
                cy.contains(annonce.description);

                // --- UPDATE ---
                cy.get("a").contains("Editer").click();
                cy.url().should("include", `/annonces/edit/${annonceId}`);
                cy.get("button").contains("Informations").should("have.class", "bg-gray-900");
                cy.get('input[id="title"]').clear().type(annonce.newTitle);
                cy.get("button").contains("Sauvegarder informations").click();
                cy.wait(5000);
                cy.get("header").contains("Accueil").click();
                cy.url().should("eq", "http://localhost:3000/");
                cy.wait(5000);

                cy.contains("h3", annonce.newTitle).closest(".group.relative").find('a[href*="/annonces/"]').click();

                cy.url().should("include", `/annonces/${annonceId}`);
                cy.get("h1").contains(annonce.newTitle);

                // --- DELETE ---
                cy.get("a").contains("Editer").click();
                cy.url().should("include", `/annonces/edit/${annonceId}`);
                cy.on("window:confirm", (str) => {
                    expect(str).to.equal(
                        "Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible."
                    );
                    return true;
                });
                cy.get("button").contains("Supprimer l’annonce").click();
                cy.url().should("eq", "http://localhost:3000/");
                cy.wait(1000);
                cy.contains(annonce.newTitle).should("not.exist");
            });
    });
});

describe("Annonce Creation Role Access", () => {
    const users = {
        user: { email: "user@example.com", password: "12345" },
        agent: { email: "agent@example.com", password: "12345" },
        admin: { email: "admin@example.com", password: "12345" },
    };

    const fillAnnonceForm = (annonceData) => {
        cy.url().should("include", "/annonces/add");

        cy.get('input[id="title"]').type(annonceData.title);
        cy.get('input[id="address"]').type(annonceData.address);
        cy.get('input[id="city"]').type(annonceData.city);
        cy.get('input[id="country"]').type(annonceData.country);
        cy.get('input[id="postalCode"]').type(annonceData.postalCode);
        cy.get('textarea[id="description"]').type(annonceData.description);
        cy.get('input[id="price"]').type(annonceData.price);
        cy.get('input[id="surface"]').type(annonceData.surface);
        cy.get('input[id="rooms"]').type(annonceData.rooms);
        cy.get('input[id="bathrooms"]').type(annonceData.bathrooms);
        cy.get('input[id="floor"]').type(annonceData.floor);
        cy.get('input[id="yearBuilt"]').type(annonceData.year);
        cy.get('input[id="avaibleFrom"]').type(annonceData.date);
        cy.get('select[id="type"]').select("SALE");
        cy.get('select[id="reStatus"]').select("FORSALE");
        cy.get('select[id="publicationStatus"]').select("PUBLISHED");
        cy.get('input[type="file"]').selectFile("cypress/fixtures/test-image.jpg", { force: true });
    };

    // Test 1: Non-Connecté
    it("should redirect an unauthenticated user to the login page", () => {
        cy.visit("http://localhost:3000/annonces/add");

        // L'utilisateur est redirigé vers la page de connexion
        cy.url().should("include", "/login");
        cy.get("h2").contains("Bienvenue");
    });

    // Test 2: Rôle "USER"
    it('should block a "USER" role from accessing the create page', () => {
        // Se connecter en tant que simple utilisateur
        cy.login(users.user.email, users.user.password);
        cy.visit("http://localhost:3000/annonces/add");

        cy.wait(1000);
        // L'utilisateur est redirigé vers la page d'accueil
        cy.url().should("eq", "http://localhost:3000/");
    });

    // Test 3: Rôle "AGENT"
    it('should allow an "AGENT" role to create an annonce', () => {
        const testId = Date.now();
        const annonceData = {
            title: `Annonce Agent ${testId}`,
            description: "Description de test agent.",
            price: "150000",
            address: "1 Rue Agent",
            city: "Le Havre",
            country: "France",
            postalCode: "76600",
            surface: "50",
            rooms: "2",
            bathrooms: "1",
            floor: "1",
            year: "2000",
            date: "2025-01-01",
        };

        // Se connecter en tant qu'agent
        cy.login(users.agent.email, users.agent.password);
        cy.wait(1000);
        cy.visit("http://localhost:3000/annonces/add");
        cy.wait(1000);

        fillAnnonceForm(annonceData);
        cy.wait(1000);
        cy.get("button").contains("Ajouter l'annonce").click();
        cy.wait(1000);
        cy.url().should("eq", "http://localhost:3000/");
        cy.wait(1000);
        cy.contains(annonceData.title);
    });

    // Test 4: Rôle "ADMIN"
    it('should allow an "ADMIN" role to create an annonce', () => {
        const testId = Date.now();
        const annonceData = {
            title: `Annonce Admin ${testId}`,
            description: "Description de test admin.",
            price: "999000",
            address: "2 Rue Admin",
            city: "Le Havre",
            country: "France",
            postalCode: "76600",
            surface: "120",
            rooms: "5",
            bathrooms: "2",
            floor: "3",
            year: "2020",
            date: "2025-01-01",
        };
        cy.wait(1000);
        cy.login(users.admin.email, users.admin.password);
        cy.wait(1000);
        cy.visit("http://localhost:3000/annonces/add");
        cy.wait(1000);
        fillAnnonceForm(annonceData);
        cy.wait(1000);
        cy.get("button").contains("Ajouter l'annonce").click();
        cy.wait(1000);
        cy.url().should("eq", "http://localhost:3000/");
        cy.wait(1000);
        cy.contains(annonceData.title);
    });
});
