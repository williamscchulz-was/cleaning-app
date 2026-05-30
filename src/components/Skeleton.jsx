// Shimmering placeholder blocks shown while the first Firestore snapshot
// loads, so the screen has structure instead of a blank flash.

export function SkeletonLine({ width = '100%', height = 14, className = '' }) {
  return (
    <div
      className={`shimmer rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonRow({ isLast }) {
  return (
    <div
      className={`flex items-center gap-3 pl-4 pr-3 py-3.5 ${!isLast ? 'border-b bd-hairline' : ''}`}
      style={!isLast ? { borderBottomWidth: '0.5px' } : undefined}
    >
      <div className="shimmer rounded-full shrink-0" style={{ width: 22, height: 22 }} />
      <div className="flex-1 min-w-0">
        <SkeletonLine width="62%" height={15} />
      </div>
      <SkeletonLine width={52} height={12} />
    </div>
  );
}

// A whole "today"-style screen skeleton: title, progress, two area cards.
export default function TodaySkeleton() {
  return (
    <div className="pb-12" aria-hidden>
      <div className="px-5 pt-8 pb-3">
        <SkeletonLine width={140} height={12} />
        <div className="mt-2">
          <SkeletonLine width={180} height={32} />
        </div>
      </div>
      <div className="px-5 mt-3 flex items-center gap-3">
        <div className="flex-1">
          <SkeletonLine height={6} />
        </div>
        <SkeletonLine width={34} height={14} />
      </div>
      <div className="space-y-7 mt-7">
        {[3, 2].map((rows, s) => (
          <section key={s} className="px-4">
            <div className="px-4 mb-1.5">
              <SkeletonLine width={90} height={12} />
            </div>
            <div className="surf-card rounded-xl overflow-hidden">
              {Array.from({ length: rows }, (_, i) => (
                <SkeletonRow key={i} isLast={i === rows - 1} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
