const PoweredBy = () => {
  return (
    <div className="bg-primitives-color-purple-purple-200 relative flex items-center justify-center py-[9px]">
      <p className="text-tokens-label text-[13px] font-normal tracking-[0.20px] opacity-80">
        <span className="text-[#000000e6]">Powered by |&nbsp;</span>
        <a href="https://mvpworkshop.co/" rel="noopener noreferrer" target="_blank">
          <span className="text-[#6331f5] underline">MVP Workshop</span>
        </a>
      </p>
    </div>
  );
};

export default PoweredBy;
