const processHierarchies = (data) => {
    let duplicate_edges = [];
    let invalid_entries = [];
    let validEdges = [];
    let seenPairs = new Set();
    let duplicatesSet = new Set();

    let parentMap = new Map();
    let childrenMap = new Map();
    let allNodes = new Set();

    data.forEach(item => {
        if (typeof item !== 'string') {
            invalid_entries.push(String(item));
            return;
        }
        let trimmed = item.trim();
        if (!/^[A-Z]->[A-Z]$/.test(trimmed)) {
            invalid_entries.push(item);
            return;
        }
        let u = trimmed[0];
        let v = trimmed[3];
        if (u === v) {
            invalid_entries.push(item);
            return;
        }
        if (seenPairs.has(trimmed)) {
            if (!duplicatesSet.has(trimmed)) {
                duplicatesSet.add(trimmed);
                duplicate_edges.push(trimmed);
            }
            return;
        }
        seenPairs.add(trimmed);
        allNodes.add(u);
        allNodes.add(v);

        if (!parentMap.has(v)) {
            parentMap.set(v, u);
            if (!childrenMap.has(u)) childrenMap.set(u, []);
            childrenMap.get(u).push(v);
        }
    });

    let roots = [];
    for (let node of allNodes) {
        if (!parentMap.has(node)) {
            roots.push(node);
        }
    }

    let visited = new Set();

    function buildTree(root) {
        visited.add(root);
        let treeObj = {};
        let children = childrenMap.get(root) || [];
        let maxDepth = 1;
        
        children.sort();

        for (let child of children) {
            let childResult = buildTree(child);
            treeObj[child] = childResult.tree;
            maxDepth = Math.max(maxDepth, 1 + childResult.depth);
        }
        return { tree: treeObj, depth: maxDepth };
    }

    let hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_tree_depth = 0;

    roots.sort();
    for (let root of roots) {
        let { tree, depth } = buildTree(root);
        hierarchies.push({
            root: root,
            tree: tree,
            depth: depth
        });
        total_trees++;
        if (depth > max_tree_depth) {
            max_tree_depth = depth;
            largest_tree_root = root;
        } else if (depth === max_tree_depth) {
            if (largest_tree_root === null || root < largest_tree_root) {
                largest_tree_root = root;
            }
        }
    }

    let unvisitedNodes = [];
    for (let node of allNodes) {
        if (!visited.has(node)) {
            unvisitedNodes.push(node);
        }
    }

    while (unvisitedNodes.length > 0) {
        let start = unvisitedNodes.pop();
        if (visited.has(start)) continue;

        let cycleNodes = [];
        let curr = start;
        while (!visited.has(curr)) {
            visited.add(curr);
            cycleNodes.push(curr);
            curr = parentMap.get(curr);
        }
        
        cycleNodes.sort();
        let root = cycleNodes[0];

        hierarchies.push({
            root: root,
            tree: {},
            has_cycle: true
        });
        total_cycles++;
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
};

module.exports = { processHierarchies };
