type GetRelatedScenariosParams = {
  readonly locale: string;
  readonly userId: string;
  readonly slug: string;
};

/**
 * Related scenarios will be restored after all native scenario
 * definitions have been added to the content registry.
 */
export function getRelatedScenarios(params: GetRelatedScenariosParams): Promise<never[]> {
  void params;

  return Promise.resolve([]);
}
