/**
 * Hydrate this component only on the client
 */
(self.Wromo = self.Wromo || {}).only = (getHydrateCallback) => {
	(async () => {
		let hydrate = await getHydrateCallback();
		await hydrate();
	})();
};
