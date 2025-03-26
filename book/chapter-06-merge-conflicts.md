# Handling Merge Conflicts and Rebasing


Recently, one of our Pull Requests couldn't be merged. This is due to a "merge conflict." Here’s why:
 - A branch forked from main at a point in time before another PR was merged into main.
 - Both commits introduced similar or overlapping code in separate branches.

This is a common occurrence in Git workflows. The goal is to reconcile
changes from multiple contributors and keep everyone’s local branches in sync
with main.

## Two Approaches to Handling Merge Conflicts

When you face merge conflicts, you have two main ways to resolve them: Merging or Rebasing.

### Merging

This approach merges the branch into main directly. While on main, you merge the feature branch inward with `git merge feature-branch`. You’ll see merge conflicts during the merge, then resolve them and complete the PR. Typically done by pulling the branch locally, merging main into it, fixing conflicts, and pushing a new main branch up. However, this will invalidate the Pull Request.

### Rebasing

Rebasing is similar to merging, but it “merges main underneath” your current branch. Instead of merging while on main, you remain on the feature branch and `git rebase main`. This effectively places all the missing commits from main “underneath” the feature branch's commits, so that the friend’s branch contains everything in main first.

This is preferred because it creates a clean linear history that can then be merged in Github like before.

## Addressing Merge Conflicts

Regardless of approach, merge conflicts happen when Git cannot automatically reconcile differences in the same part of the same file. **Git will pause its merge or rebase operation and highlight conflicts in your working files.**

### Conflict Markers

When Git encounters conflicts, it inserts conflict markers into the files with conflicts. For example:

```
<<<<<<< HEAD
console.log("This code is from main.");
=======
console.log("This code is from the feature branch.");
>>>>>>> friends/feature-branch
```

- <<<<<<< HEAD indicates the beginning of the block from the current branch (for merges) or the local commit (for rebases).
- ======= is the separator between the two conflicting changes.
- >>>>>>> friend/feature-branch indicates the end of the block and specifies the “other” branch (or commit) we are merging or rebasing against.

**You must manually edit the file to remove the conflict markers and keep the correct code. This might mean combining lines from both sections, choosing one, or rewriting it entirely.**

Once complete, you'll need to "finish" the merge or rebase in a similar way to committing. `git add` the files you ave corrected and then either `git merge --continue` or `git rebease --continue`.

## Force Pushing

When you have opted to rebase (which you should) you'll encounter a problem when trying to push your updated branch to Github. It will reject it because the code it has seems to conflict (still) with the code you're giving it. You'll need to **force push** to correct for this.

When you run `git push --force`, you are telling Git to overwrite the remote branch’s history with your local changes, even if doing so would normally be rejected by Git’s protections. Force pushing is typically necessary when you’ve rewritten commit history in your local branch (by rebasing) and need to make the remote branch match that new history exactly.

### Why Do We Need It After a Rebase?

1. Rewriting History: Rebasing changes the parent commit for each of your local commits, effectively creating new commits (even if the source code is the same).
2. Divergence: After rebasing, your local branch’s commit history no longer matches the remote branch’s commit history. If you push without force, Git will complain that the remote has commits that don’t exist locally—because from Git’s perspective, you’ve “deleted” or “modified” commits.
3. Force Push: By forcing the push, you say, “Forget the remote’s existing commits—replace them with my local commits.” This ensures the remote’s commit history is updated to reflect your newly rebased (rewritten) history.

#### The Dangers of Force Push
-Overwriting Others’ Work: If teammates have based their work on the commits you’re about to overwrite, they can lose those commits or face complex conflicts.
-History Loss: Once overwritten commits are gone from the remote branch, they can be challenging (sometimes impossible) for collaborators to recover.
-Team Confusion: Anyone who has already pulled the old commits onto their local machine will face confusion and additional merges or rebases when they sync again.

Because of these risks, only force push if you're pushing to your own feature branch and don't expect others to be using it.
