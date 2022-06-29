(self.Wromo = self.Wromo || {}).load = (getHydrateCallback) => {
	(async () => {
		let hydrate = await getHydrateCallback();
		await hydrate();
	})();
};
