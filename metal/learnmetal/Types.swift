struct Vertex {
    var position: SIMD3<Float>
    var color: SIMD4<Float>
}


protocol Sizeable {
    static func size(_ count: Int) -> Int
    static func stride(_ count: Int) -> Int
}

extension Sizeable {
    static func size() -> Int {
        return MemoryLayout<Self>.size
    }

    static func stride() -> Int {
        return MemoryLayout<Self>.stride
    }

    static func size(_ count: Int) -> Int {
        return Self.size() * count;
    }

    static func stride(_ count: Int) -> Int {
        return Self.stride() * count;
    }
}

extension Vertex : Sizeable { }

extension SIMD3 : Sizeable where Scalar == Float  { }
