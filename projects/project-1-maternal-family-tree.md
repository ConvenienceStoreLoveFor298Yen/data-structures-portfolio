# Project 1: Recursive Structure Engine

A Python tree of one side of a family, with recursive traversals, search, and tests.

<div><canvas id="family-canvas" width="340" height="320"></canvas></div>

<p>
  <button id="btn-preorder">Pre-order</button>
  <button id="btn-postorder">Post-order</button>
  <button id="btn-find-leo">Find Leo</button>
  <button id="btn-find-zed">Find Zed</button>
</p>

<p id="family-status">Yellow = visiting now, blue = visited, green = found.</p>

<script src="{{ '/assets/js/family-tree-viz.js' | relative_url }}"></script>

## Explanation

My tree is the maternal side of a family, with the grandmother as the root. A real family tree isn't actually a tree since everyone has two parents, so each person only links to their kids on this side. Each `PersonNode` stores a name, an age, and a list of children. I used a list instead of left and right because people can have more than two kids, which also means there's no inorder traversal, since inorder only works for binary trees. The program supports preorder, postorder, finding a person, the path from the grandmother to a person, counting members, and height.

Each recursive method handles one person, then calls itself on each child, and stops when the person is `None`. Preorder records a person before their kids, which I use for printing and search. Postorder records them after, which I use for the tree's height, meaning how many generations are below the grandmother. A person's number of generations below them depends on their kids' numbers first, so the kids have to be done before the parent.

I wrote search both ways, and they return the same results. The recursive version lets Python's call stack keep track of who's left to check, while the iterative version keeps its own list as a stack. Either way, search is O(n) because the tree isn't ordered by name, so unlike a BST search by key, it can't skip subtrees and might have to check every person.

## Example output

```
Preorder:  ['Rosa', 'Ana', 'Mia', 'Leo', 'Sam', 'Luis', 'Eva', 'Clara']
Postorder: ['Leo', 'Mia', 'Sam', 'Ana', 'Eva', 'Luis', 'Clara', 'Rosa']
Path to Leo: ['Rosa', 'Ana', 'Mia', 'Leo']

TEST 12: find Leo, 4 generations deep, recursive (normal)
  Expected: Leo
  Actual:   Leo
  Result:   PASS

TEST 13: search an empty tree, recursive (edge)
  Expected: None
  Actual:   None
  Result:   PASS

TEST 14: search for Zed, who is not in the tree, recursive (failure)
  Expected: None
  Actual:   None
  Result:   PASS

25 / 25 tests passed
```

[Back to Projects](../projects.md)
