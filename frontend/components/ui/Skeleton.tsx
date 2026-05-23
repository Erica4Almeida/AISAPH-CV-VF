interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: React.CSSProperties
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
      aria-hidden="true"
    />
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton height={200} borderRadius={0} />
      <div className="skeleton-body">
        <Skeleton width={80} height={11} />
        <Skeleton width="65%" height={22} />
        <Skeleton height={12} />
        <Skeleton height={12} />
        <Skeleton width="50%" height={12} />
        <div className="skeleton-row">
          <Skeleton width={60} height={12} />
          <Skeleton width={80} height={12} />
        </div>
        <Skeleton width={80} height={14} />
      </div>
    </div>
  )
}

export function TurmaCardSkeleton() {
  return (
    <div className="skeleton-turma" aria-hidden="true">
      <Skeleton width={64} height={72} borderRadius={10} />
      <div className="skeleton-turma-info">
        <Skeleton width="60%" height={18} />
        <Skeleton width="80%" height={13} />
        <Skeleton width="40%" height={13} />
      </div>
    </div>
  )
}

export function FaqItemSkeleton() {
  return (
    <div className="skeleton-faq" aria-hidden="true">
      <Skeleton width="75%" height={16} />
    </div>
  )
}
