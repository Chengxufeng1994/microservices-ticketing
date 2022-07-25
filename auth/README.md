# Auth Service

# Exposing to the world via port forwarding

The simplest way to expose the API gateway to the world is by port-forwrding the Kubernetes service directly:

```
kubectl port-forward svc/auth 3000:3000
```