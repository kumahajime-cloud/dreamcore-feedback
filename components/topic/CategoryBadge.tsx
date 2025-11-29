import { Badge } from '@/components/ui/badge'

type Category = 'bug_report' | 'feature_request' | 'feedback' | 'discussion'

interface CategoryBadgeProps {
  category: Category
}

const categoryConfig = {
  bug_report: {
    label: 'Bug Report',
    className: 'bg-red-500 hover:bg-red-600',
  },
  feature_request: {
    label: 'Feature Request',
    className: 'bg-blue-500 hover:bg-blue-600',
  },
  feedback: {
    label: 'Feedback',
    className: 'bg-green-500 hover:bg-green-600',
  },
  discussion: {
    label: 'Discussion',
    className: 'bg-purple-500 hover:bg-purple-600',
  },
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category]

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}
