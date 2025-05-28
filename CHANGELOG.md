# Changelog

## 1.0.0 (2025-05-28)


### Features

* add configurable options for Fuse and Clusterize in PlantaeFilterElement ([63698ad](https://github.com/plantae-tecnologies/plantae-filter/commit/63698ad43d849d574baabb1253536c44018c22a4))
* add debounced updateOptions method to PlantaeFilterElement for improved performance ([531566d](https://github.com/plantae-tecnologies/plantae-filter/commit/531566d4eeecc76033a96e53088e213f36c358da))
* add enable and disable methods for options in PlantaeFilter and update related types ([65207b0](https://github.com/plantae-tecnologies/plantae-filter/commit/65207b00182e8f63273d75b50c53e8331c7b2455))
* add GitHub Actions workflow for NPM publishing ([25b2e19](https://github.com/plantae-tecnologies/plantae-filter/commit/25b2e199c38069482e4a5edde954ef69be9a99a4))
* add methods to enable and disable options, and dispatch event when filter is ready ([04fbfa3](https://github.com/plantae-tecnologies/plantae-filter/commit/04fbfa32bf8dcf95f78c0b10e6716b954c005acb))
* add new utility functions for attribute handling and improve PlantaeFilterElement configuration ([2dcdda0](https://github.com/plantae-tecnologies/plantae-filter/commit/2dcdda077c8055ee031735da2d2fade4130b45a3))
* add PlantaeFilter and PlantaeFilterElement components with utility functions and example usage ([90a0abb](https://github.com/plantae-tecnologies/plantae-filter/commit/90a0abb839878e1780b10aea5699a59f0997e827))
* add plantaeFilter reference to DOM elements for easy API access ([e8ce5b8](https://github.com/plantae-tecnologies/plantae-filter/commit/e8ce5b86411a7b8a88fa56ee0eff585506587dcf))
* add public API tests for plantae-filter component, including addOption, removeOptions, and selection methods ([5f26289](https://github.com/plantae-tecnologies/plantae-filter/commit/5f262896435c8d792d31c9989b29f7ab96186115))
* add selectElement property to PlantaeFilterElement for improved option handling ([1b133ac](https://github.com/plantae-tecnologies/plantae-filter/commit/1b133ac18c29af55febc27bf6f25b6a3f8f360a4))
* add setValue method and refactor getSelected method name to getValue ([01e4e26](https://github.com/plantae-tecnologies/plantae-filter/commit/01e4e266ce7d1391b38f3978802690c6f4a2bec9))
* add Vitest configuration and setup for testing, update tsconfig and Vite config, and implement tests for plantae-filter component ([0c1a262](https://github.com/plantae-tecnologies/plantae-filter/commit/0c1a262c78beb492d3fe9fae602e8153f364f5c6))
* enhance demo page ([590f883](https://github.com/plantae-tecnologies/plantae-filter/commit/590f883654d2e3a9e83607c10555014572ea0289))
* enhance PlantaeFilter attributes and improve search worker initialization ([22ba683](https://github.com/plantae-tecnologies/plantae-filter/commit/22ba683d2ae64d1a7e7e3a1076897b3eff72464e))
* enhance PlantaeFilter with improved option handling and UI updates in demo ([a8c1726](https://github.com/plantae-tecnologies/plantae-filter/commit/a8c17268659726feacaae3558420de4a3b8333b3))
* enhance PlantaeFilterElement with improved dropdown styling and accessibility features ([3124a3d](https://github.com/plantae-tecnologies/plantae-filter/commit/3124a3de5b5398e2291de15c4c9ad373f0cbccde))
* enhance PlantaeFilterElement with search result highlighting and overlapping index merging ([24631a5](https://github.com/plantae-tecnologies/plantae-filter/commit/24631a5ad5d9cac53f8e07415fe8ce8c19bdd6d9))
* implement deselectOptions method and update related tests ([acdba2d](https://github.com/plantae-tecnologies/plantae-filter/commit/acdba2d3513ed43eaf978db4f9c5ac1f768abe6d))
* implement loading indicator and enhance search functionality with Web Workers ([ac16af3](https://github.com/plantae-tecnologies/plantae-filter/commit/ac16af310d2b98c719e27d7ac4a43f75ad2a05a0))
* implement search engine interface and worker for improved search functionality ([84bc945](https://github.com/plantae-tecnologies/plantae-filter/commit/84bc945dfc64d7702244b32faed105f591267ba5))
* refactor PlantaeFilterElement to remove selectElement property and improve option handling ([caa82e2](https://github.com/plantae-tecnologies/plantae-filter/commit/caa82e204475bb0cf265015cd3f957bf14ab0315))
* refactor search worker implementation to use Blob for dynamic worker creation and remove deprecated file ([bd3c638](https://github.com/plantae-tecnologies/plantae-filter/commit/bd3c638ed8e3bae5c08984f8303c9337c28ca4cf))
* update counter-filter element to use 'part' attribute for improved styling ([c22e5ef](https://github.com/plantae-tecnologies/plantae-filter/commit/c22e5ef51555f2ce797ed11b798e83c12c3f95ea))
* update PlantaeFilterElement methods and enhance README with search debounce delay option ([e120ee0](https://github.com/plantae-tecnologies/plantae-filter/commit/e120ee0ffcbc56a44ae2db4f6804e8c6f30b71be))
* update PlantaeFilterElement with new configuration attributes and improve styling ([d230c10](https://github.com/plantae-tecnologies/plantae-filter/commit/d230c109e2dbd3c3ba9750bfbe87a73cb86bf2cb))
* update README and component to include counter-filter part for improved accessibility ([10ad661](https://github.com/plantae-tecnologies/plantae-filter/commit/10ad6615adf0d23a7950ed816ebab2708dc23082))
* update search worker initialization and adjust button label for bulk population ([6065da5](https://github.com/plantae-tecnologies/plantae-filter/commit/6065da53e35fd99d9e76174c0fd31032da684002))
* update search worker initialization and increase assets inline limit in Vite config ([782f310](https://github.com/plantae-tecnologies/plantae-filter/commit/782f310b145bbec557375a25e2aa9b8911e7866c))
* update searchEngineMode to support 'fuse' and 'fuse-worker' options ([97b2168](https://github.com/plantae-tecnologies/plantae-filter/commit/97b21685cbb65b1f0799f5e78cd9bd74f291ceba))


### Bug Fixes

* ensure build process runs before versioning and publishing ([a7597f2](https://github.com/plantae-tecnologies/plantae-filter/commit/a7597f2fa696a0b0092ff7fb42e89105a4a4e703))
* fix addOptions method adding new options in the optionMap ([556d433](https://github.com/plantae-tecnologies/plantae-filter/commit/556d433dd6056b0238c01b92863d8a3255334313))
* fix general problems with dynamic values ([acf9f9f](https://github.com/plantae-tecnologies/plantae-filter/commit/acf9f9f521ea0d485c7f10eb6b33720b8ecb0747))
* remove redundant semicolon in getSelected method ([25495c2](https://github.com/plantae-tecnologies/plantae-filter/commit/25495c2ac5c1f0ebbeda83452139d753f20d8eea))
* update attribute names in PlantaeFilterElement and enhance README with available attributes ([d09ddd4](https://github.com/plantae-tecnologies/plantae-filter/commit/d09ddd471e87c3f0d7933c96497bd5b38c297c3a))
* update package.json and vite.config.lib.ts for improved type definitions and theme path handling ([446ce61](https://github.com/plantae-tecnologies/plantae-filter/commit/446ce61191ed5326b4d42d70b23de7218d9606f6))


### Performance Improvements

* optimize selected option lookups using optionMap instead of filtering options array ([2f7804c](https://github.com/plantae-tecnologies/plantae-filter/commit/2f7804c30a515b6d2ee9f6c85d47a0e6647b5e7f))
