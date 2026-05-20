export const isMaintenanceDue = (asset) => {
  const condition = asset.conditionState?.toUpperCase();
  return condition === 'REPAIR_NEEDED' || condition === 'DAMAGED';
};
