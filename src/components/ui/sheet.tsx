const sheetVariants = {
  base: "fixed z-[51] gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  // Keep SheetOverlay at z-50
  overlay: "fixed z-50"
};

export default sheetVariants;